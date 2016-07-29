module ForemanAnsible
  class AnsibleProxyImporter
    attr_reader :ansible_proxy

    def initialize(proxy = nil)
      @ansible_proxy = proxy
    end

    def proxy_api
      return @proxy_api if @proxy_api
      find_proxy_api
    end

    private

    def find_proxy_api
      raise ::Foreman::Exception.new(N_("Proxy not found")) unless ansible_proxy
      raise ::Foreman::Exception.new(N_("Proxy must have Ansible feature")) unless ansible_proxy.has_feature? 'Ansible'
      @proxy_api = ::ProxyAPI::Ansible.new(:url => ansible_proxy.url)
    end
  end
end
