class UiAnsiblePlaybooksController < ::Api::V2::BaseController
  def resource_name(resource = 'JobTemplate')
    super resource
  end

  def index
    @ui_ansible_playbooks = resource_scope_for_index(:permission => :view_job_templates).where(:job_category => 'Ansible Playbook')
  end
end
