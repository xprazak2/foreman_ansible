module ForemanAnsible
  class FilesImporter < AnsibleProxyImporter

    def import(ansible_file)
      file_content = proxy_api.file(ansible_file.ansible_role.name, ansible_file.dir, ansible_file.name)
      ansible_file.content = file_content['content']
      ansible_file
    end

    def update(ansible_file)
      res = proxy_api.update_file(ansible_file.ansible_role.name, ansible_file.dir, ansible_file.name, ansible_file.content)
      res['updated']
    end

    def delete(ansible_file)
      proxy_api.delete_file(ansible_file.ansible_role.name, ansible_file.dir, ansible_file.name)
    end
  end
end
