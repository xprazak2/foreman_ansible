require 'deface'
module ForemanAnsible
  # This engine connects ForemanAnsible with Foreman core
  class Engine < ::Rails::Engine
    engine_name 'foreman_ansible'

    config.autoload_paths += Dir["#{config.root}/app/controllers/concerns"]
    config.autoload_paths += Dir["#{config.root}/app/helpers"]
    config.autoload_paths += Dir["#{config.root}/app/overrides"]
    config.autoload_paths += Dir["#{config.root}/app/services"]
    config.autoload_paths += Dir["#{config.root}/app/views"]
    config.autoload_paths += Dir["#{config.root}/app/lib"]

    initializer 'foreman_ansible.register_plugin', :before => :finisher_hook do
      Foreman::Plugin.register :foreman_ansible do
        # We need ActiveJob, only available post-1.12 because of Rails 4.2
        requires_foreman '>= 1.12'

        divider :top_menu, :caption => N_('Ansible'), :parent => :configure_menu
        menu :top_menu, :ansible_roles, :caption => N_('Roles'),
          :url_hash => { :controller => 'foreman_ansible/ansible_roles', :action => :index }, :parent => :configure_menu
      end
    end

    # Add any db migrations
    initializer 'foreman_remote_execution.load_app_instance_data' do |app|
      ForemanAnsible::Engine.paths['db/migrate'].existent.each do |path|
        app.config.paths['db/migrate'] << path
      end
    end

    config.to_prepare do
      begin
        ::FactImporter.register_fact_importer(:ansible,
                                              ForemanAnsible::FactImporter)
        ::FactParser.register_fact_parser(:ansible, ForemanAnsible::FactParser)
        ::Host::Managed.send(:include, ForemanAnsible::HostManagedExtensions)
        ::HostsHelper.send(:include, ForemanAnsible::HostsHelperExtensions)
        ::HostsController.send(
          :include, ForemanAnsible::Concerns::HostsControllerExtensions)
      rescue => e
        Rails.logger.warn "Foreman Ansible: skipping engine hook (#{e})"
      end
    end
  end

  def self.use_relative_model_naming?
    true
  end
end
