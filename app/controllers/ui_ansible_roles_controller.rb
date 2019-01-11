class UiAnsibleRolesController < ::Api::V2::BaseController
  def resource_name(resource = 'AnsibleRole')
    super resource
  end

  def index
    @ui_ansible_roles = resource_scope_for_index(:permission => :view_ansible_roles).includes(:ansible_variables)
    overrides = calculate_variable_overrides(params[:resource_id],
                                             params[:resource_name],
                                             AnsibleVariable.where(:ansible_role_id => @ui_ansible_roles.pluck(:id)))
    @override_resolver = ForemanAnsible::OverrideResolver.new(overrides)
  end

  # restore original method from find_common to ignore resource nesting
  def resource_scope(options = {})
    @resource_scope ||= scope_for(resource_class, options)
  end

  private

  def calculate_variable_overrides(host_or_hg_id, resource_name, ansible_variables)
    return {} if !host_or_hg_id || !resource_name
    resource = resource_name.constantize.find host_or_hg_id
    return {} unless resource
    ansible_variables.values_hash(resource).raw
  end
end
