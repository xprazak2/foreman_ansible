class AnsiblePlaybooksController < ReactController

  def index
  #   @ansible_playbooks = resource_base.search_for(params[:search],
  #                                                 :order => params[:order]).
  #                        paginate(:page => params[:page],
  #                                 :per_page => params[:per_page])
  end

  # def import
  #   PlaybooksImporter.new.import
  # end

  # def confirm_import
  #   PlaybooksImporter.new.finish_import(params[])
  # end

  # def resource_base
  #   @resource_base ||= JobTemplate.where(:job_category => 'Ansible Playbook').authorized(current_permission)
  # end

  # def action_permission
  #   case params[:action]
  #     when 'index'
  #       'view_job_templates'
  #     else
  #       super
  #   end
  # end
end
