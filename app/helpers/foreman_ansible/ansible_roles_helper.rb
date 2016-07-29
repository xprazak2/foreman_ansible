module ForemanAnsible
  # Small convenience to list all roles in the UI
  module AnsibleRolesHelper
    def ansible_proxy_links(hash, classes = nil)
      SmartProxy.with_features("Ansible").map do |proxy|
        display_link_if_authorized(_("Import from %s") % proxy.name, hash.merge(:proxy => proxy), { :class => classes })
      end.flatten
    end

    def ansible_proxy_import(hash)
      select_action_button(_('Import'), {}, ansible_proxy_links(hash))
    end

    def import_time(role)
      _("%s ago") % time_ago_in_words(role.updated_at)
    end

    def ansible_proxy_links(hash, classes = nil)
      SmartProxy.with_features("Ansible").map do |proxy|
        display_link_if_authorized(_("Import from %s") % proxy.name, hash.merge(:proxy => proxy), { :class => classes })
      end.flatten
    end

    def ansible_proxy_import(hash)
      select_action_button(_('Import'), {}, ansible_proxy_links(hash))
    end

    def files_for_role(role, dirname)
      "ansible_role = #{role} && dir = #{dirname}"
    end

    def link_to_ansible_files(role, dirname)
      link_to_if_authorized(role.file_count(dirname), hash_for_ansible_files_path(:search => files_for_role(role, dirname)))
    end
  end
end
