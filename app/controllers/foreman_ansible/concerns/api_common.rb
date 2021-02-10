# frozen_string_literal: true

module ForemanAnsible
  module Concerns
    # Shared task methods between api controllers
    module ApiCommon
      extend ActiveSupport::Concern
      def find_ansible_roles
        ids = params.fetch(:ansible_role_ids, []) || []
        @ansible_roles = AnsibleRole.authorized(:view_ansible_roles).find(ids)
      end

      # def update_associations
      #   if controller_name == 'hosts'
      #     join_model = HostAnsibleRole
      #     foreign_key = :host_id
      #     join_attrs = :host_ansible_roles_attributes
      #   else
      #     join_model = HostgroupAnsibleRole
      #     foreign_key = :hostgroup_id
      #     join_attrs = :hostgroup_ansible_roles_attributes
      #   end

      #   instance = instance_variable_get("@#{controller_name.singularize}")

      #   attrs = find_ansible_roles_attributes params, join_model, foreign_key, instance
      #   instance.update join_attrs => attrs
      # rescue ActiveRecord::RecordNotFound => e
      #   not_found(e.message)
      # end

      # def find_ansible_roles_attributes(params, join_model, foreign_key, instance)
      #   ids = params.delete(:ansible_role_ids) || []
      #   roles = AnsibleRole.authorized(:view_ansible_roles).find(ids)
      #   existing_roles = instance ? instance.ansible_roles : []
      #   joins_to_remove = instance ? join_model.where(:ansible_role_id => existing_roles - roles, foreign_key => instance.id) : []

      #   attrs = roles.each_with_index.each_with_object([]) do |(role, idx), memo|
      #     join_record = join_model.find_or_initialize_by(
      #       :ansible_role_id => role.id,
      #       foreign_key => instance.id
      #     )

      #     memo.push(:id => join_record.id, :ansible_role_id => role.id, foreign_key => instance.id, :position => idx)
      #   end

      #   joins_to_remove.each_with_index.each_with_object(attrs) do |(model, _idx), memo|
      #     memo.push(:id => model.id, :_destroy => true)
      #   end
      # end
    end
  end
end
