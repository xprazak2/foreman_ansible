module ForemanAnsible
  class AnsibleRolesController < ::ApplicationController
    include Foreman::Controller::AutoCompleteSearch

    before_action :find_role, :only => [:destroy]
    before_action :find_proxy, :only => [:import]
    before_action :create_importer, :only => [:import, :confirm_import]
    before_action :create_importer, :only => [:import]

    def index
      @roles = resource_base.search_for(params[:search], :order => params[:order])
        .paginate(:page => params[:page], :per_page => params[:per_page])
    end

    def destroy
      if @role.destroy
        process_success
      else
        process_error :object => @role
      end
    end

    def import
      @changed = @importer.import
    end

    def confirm_import
      @importer.finish_import(params[:changed])
      notice _('Import of Roles successfully finished.')
      redirect_to ansible_roles_path
    end

    private

    def find_role
      @role = resource_base.find_by_id(params[:id])
    end

    def find_proxy
      @proxy = SmartProxy.find(params[:proxy])
    end

    def create_importer
      @importer = RolesImporter.new(@proxy)
    end
  end
end
