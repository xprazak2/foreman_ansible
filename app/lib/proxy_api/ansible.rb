module ProxyAPI
  class Ansible < ::ProxyAPI::Resource
    def initialize(args)
      @url = args[:url] + '/ansible/'
      super args
    end

    def roles
      parse(get 'roles')
    rescue => e
      raise ProxyException.new(url, e, N_('Unable to get roles from Ansible'))
    end
  end
end
