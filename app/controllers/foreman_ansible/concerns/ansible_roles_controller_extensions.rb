module ForemanAnsible
  module Concerns
    module AnsibleRolesControllerExtensions
      def get_variable_action(kind)
        { 'new' => _('Add'), 'obsolete' => _('Remove'), 'update' => _('Update') }[kind]
      end

      def get_role_action(kind)
        { 'new' => _('Import Role '), 'obsolete' => _('Remove Role'), 'old' => _('Update Role Variables') }[kind]
      end

      def get_old_roles_variables(imported_variables, role)
        variables = { 'Add' => [], 'Remove' => [], 'Update' => [] }
        imported_variables.each do |kind, temp_variables|
          temp_variables.each do |temp_variable|
            variables[get_variable_action(kind)].append(temp_variable.key) if temp_variable.ansible_role_id == role.id
          end
        end
        variables
      end

      def variables_to_s(variables)
        str = ''
        variables.each do |action, temp_variables|
          str += "#{action}: #{temp_variables.size} " unless temp_variables.empty?
        end
        str
      end

      def get_roles_variables(imported_variables, kind, role)
        if kind == 'new'
          variables = { 'Add' => @importer.get_variables_names(role)[role.name] }
        elsif kind == 'obsolete'
          variables = { 'Remove' => role.ansible_variables.map(&:key) }
        elsif kind == 'old'
          variables = get_old_roles_variables(imported_variables, role)
        end
        variables_to_s(variables)
      end

      def prepare_rows(changed)
        rows = []
        changed.each do |kind, roles|
          imported_variables = @variables_importer.import_variable_names(roles)
          roles.each do |role|
            role_action = get_role_action(kind)
            variables = get_roles_variables(imported_variables, kind, role)
            next if variables.empty?
            rows.append({ cells: [
                          role.name,
                          role_action, variables,
                          role_action == 'Remove Role' ? role.hosts.count : '',
                          role_action == 'Remove Role' ? role.hostgroups.count : ''
                        ],
                          role: role, kind: kind, id: role.name })
          end
        end
        rows
      end
    end
  end
end
