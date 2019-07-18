class UiAnsibleVariablesController < ::Api::V2::BaseController
  def resource_name(resource = 'AnsibleVariable')
    super resource
  end

  def index
    # @ui_ansible_variables = AnsibleVariable.where(:ansible_role_id => params[:ansible_role_ids])
    @ui_ansible_variables = resource_scope_for_index
    @override_resolver = ForemanAnsible::OverrideResolver.new(params[:resource_id],
                                                              params[:resource_name],
                                                              @ui_ansible_variables)
  end

  def resource_scope(options = {})
    @resource_scope ||= scope_for(resource_class, options)
  end
end
