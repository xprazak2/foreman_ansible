# frozen_string_literal: true

module ForemanAnsible
  module Concerns
    # Shared task methods between api controllers
    module ApiCommon
      extend ActiveSupport::Concern
      def update_associations
        if controller_name == 'hosts'
          join_model = HostAnsibleRole
          foreign_key = :host_id
        else
          join_model = HostgroupAnsibleRole
          foreign_key = :hostgroup_id
        end

        instance = instance_variable_get("@#{controller_name.singularize}")

        ids = params.fetch(:ansible_role_ids, []) || []
        roles = AnsibleRole.authorized(:view_ansible_roles).find(ids)
        join_records = roles.each_with_index.map do |role, idx|
          join_record = join_model.find_or_initialize_by(
            :ansible_role_id => role.id,
            foreign_key => instance.id
          )
          join_record.position = idx
          join_record
        end

        join_model.where(foreign_key => instance.id).where.not(:id => join_records.pluck(:id).compact).destroy_all

        instance.send("#{join_model.table_name}=", join_records)
        instance.save
      rescue ActiveRecord::RecordNotFound => e
        not_found(e.message)
      end
    end
  end
end
