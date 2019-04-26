module ForemanAnsible
  class PlaybooksImporter
    include ::ForemanAnsible::ProxyAPI

    def initialize(proxy)
      @ansible_proxy = proxy
    end

    def import(path)
      proxy_api.playbooks(path)
    end
  end
end