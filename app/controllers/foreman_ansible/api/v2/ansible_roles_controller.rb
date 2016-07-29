module ForemanAnsible
  module Api
    module V2
      class AnsibleRolesController < ::Api::V2::BaseController
        include ::Api::Version2

        before_action :find_resource, :only => [:destroy]

        api :GET, '/ansible/ansible_roles', N_('List Ansible roles')
        param_group :search_and_pagination, ::Api::V2::BaseController
        def index
          @ansible_roles = resource_scope_for_index(:permission => :edit_compliance)
        end

        api :DELETE, '/ansible/ansible_role/:id', N_('Deletes Ansible role')
        param :id, :identifier, :required => true
        def destroy
          process_response @ansible_role.destroy
        end

        def resource_class
          ForemanAnsible::AnsibleRole
        end

        private

        def find_resource
          not_found and return if params[:id].blank?
          @ansible_role = resource_scope.find(params[:id])
        end
      end
    end
  end
end
