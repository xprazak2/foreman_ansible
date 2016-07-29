module ForemanAnsible
  class RolesImporter
    attr_reader :ansible_proxy

    def initialize(proxy = nil)
      @ansible_proxy = proxy
    end

    def proxy_api
      return @proxy_api if @proxy_api
      find_proxy_api
    end

    def import
      imported = proxy_api.roles.map do |role_name|
        AnsibleRole.find_or_initialize_by(:name => role_name)
      end
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

    def detect_changes(imported)
      changes = {}.with_indifferent_access
      old, changes[:new] = imported.partition { |role| role.id.present? }
      changes[:obsolete] = AnsibleRole.where.not(:id => old.map(&:id))
      changes
    end

    private

    def find_proxy_api
      raise ::Foreman::Exception.new(N_("Proxy not found")) unless ansible_proxy
      @proxy_api = ::ProxyAPI::Ansible.new(:url => ansible_proxy.url)
    end
  end
end
