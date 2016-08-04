module ForemanAnsible
  class AnsibleFilesController < ::ApplicationController
    include Foreman::Controller::AutoCompleteSearch

    before_action :find_file, :only => [:edit, :update, :destroy]
    before_action :initialize_file, :only => [:create]
    before_action :create_importer, :only => [:edit, :update, :create, :destroy]

    def index
      @files = resource_base.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page], :per_page => params[:per_page])
    end

    def edit
      @importer.import(@file)
    end

    def new
      @file = AnsibleFile.new(:ansible_role_id => params[:role_id])
    end

    def create
      if @file.valid? && @importer.create(@file)
        @file.save
        process_success :object => @file
      else
        process_error :object => @file
      end
    end

    def update
      if @file.valid? && @importer.update(@file)
        process_success :success_redirect => ansible_files_path(:search => files_index(@file))
      else
        process_error :object => @file
      end
    end

    def destroy
      if @importer.delete(@file) && @file.destroy
        process_success :object => @file
      else
        process_error :object => @file
      end
    end

    private

    def find_file
      @file = AnsibleFile.find(params[:id])
    end

    def initialize_file
      @file = AnsibleFile.new(ansible_file_params)
    end

    def create_importer
      proxy = ::SmartProxy.find(@file.ansible_role.proxy_id)
      @importer = FilesImporter.new(proxy)
    end

    def files_index(file)
      "dir = #{file.dir} && ansible_role = #{file.ansible_role.name}"
    end

    def ansible_file_params
      params.require(:ansible_file).permit(:name, :content, :ansible_role_id, :dir)
    end
  end
end
