module ForemanAnsible
  class RolesImporter < AnsibleProxyImporter
    def import
      # imported = proxy_api.roles.map do |role_name|
      #   AnsibleRole.find_or_initialize_by(:name => role_name)
      # end
      imported = process_roles proxy_api.roles
      detect_changes imported
    end

    def finish_import(changes)
      create_new_roles changes['new'] if changes['new']
      delete_old_roles changes['obsolete'] if changes['obsolete']
    end

    def create_new_roles(changes_new)
      changes_new.values.each do |new_role|
        role_hash = JSON.parse new_role
        new_files = create_new_files role_hash.delete('ansible_files')
        role = AnsibleRole.new(role_hash)
        role.ansible_files = new_files
        role.save
      end
    end

    def create_new_files(files_attrs)
      files_attrs.map { |attrs| AnsibleFile.create attrs }
    end

    def delete_old_roles(changes_old)
      changes_old.values.each do |old_role|
        AnsibleRole.find(JSON.parse(old_role)['id']).destroy
      end
    end

    def process_roles(role_names)
      role_names.map do |role_name, folders|
        role = AnsibleRole.find_or_initialize_by(:name => role_name)
        role.ansible_files = process_files role, folders
        role.ansible_proxy = ansible_proxy
        role
      end
    end

    def process_files(role, folders)
      folders.flat_map do |folder, files|
        files.flat_map do |file|
          AnsibleFile.find_or_initialize_by(:name => file, :dir => folder, :ansible_role_id => role.id)
        end
      end
    end

    def detect_changes(imported)
      changes = {}.with_indifferent_access
      old, changes[:new] = imported.partition { |role| role.id.present? }
      changes[:obsolete] = AnsibleRole.where.not(:id => old.map(&:id))
      changes
    end
  end
end
