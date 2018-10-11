# frozen_string_literal: true

module ForemanAnsible
  # Small convenience to list all roles in the UI
  module AnsibleRolesHelper
    def ansible_proxy_links(hash, classes = nil)
      SmartProxy.with_features('Ansible').map do |proxy|
        display_link_if_authorized(_('Import from %s') % proxy.name,
                                   hash.merge(:proxy => proxy),
                                   :class => classes)
      end.flatten
    end

    def ansible_role_select(f, persisted)
      blank_opt = persisted ? {} : { :include_blank => true }
      select_items = persisted ? [f.object.ansible_role] : AnsibleRole.order(:name)
      select_f f,
               :ansible_role_id,
               select_items,
               :id,
               :to_label,
               blank_opt,
               :label => _("Ansible Role"),
               :disabled => persisted,
               :required => true
    end

    def ansible_proxy_import(hash)
      select_action_button(_('Import'),
                           { :primary => true, :class => 'roles-import' },
                           ansible_proxy_links(hash))
    end

    def import_time(role)
      _('%s ago') % time_ago_in_words(role.updated_at)
    end

    def roles_attrs(roles, resource_id, resource_name)
      roles.map do |item|
        { :id => item.id,
          :name => item.name,
          :ansible_variables => variables_attrs(item.ansible_variables, resource_id, resource_name) }
      end
    end

    def variables_attrs(variables, resource_id, resource_name)
      resolver = ForemanAnsible::OverrideResolver.new(resource_id, resource_name, variables)
      variables.map do |var|
        variable_attrs(var).merge({ :current_override => resolver.resolve(var) })
      end
    end

    def variable_attrs(variable)
      methods = [:parameter, :id, :override, :required, :omit, :hidden_value, :hidden_value?, :default_value, :override_values]
      methods.reduce({}) do |memo, item|
        memo.tap { |acc| acc[item] = variable.public_send item }
      end
    end
  end
end
