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
      create_new_roles changes
      delete_old_roles changes
    end

    def create_new_roles(changes)
      changes['new'].values.each do |new_role|
        AnsibleRole.create(JSON.parse new_role)
      end
    end

    def delete_old_roles(changes)
      changes['obsolete'].values.each do |old_role|
        AnsibleRole.find(JSON.parse(old_role)['id']).destroy
      end
    end

    def process_roles(role_names)
      role_names.map do |role_name, folders|
        role = AnsibleRole.find_or_initialize_by(:name => role_name)
        role.ansible_files = process_files role, folders
        role.proxy_id = ansible_proxy.id
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

    private


  end
end
