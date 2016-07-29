# Simple model to store basic info about the Ansible role
module ForemanAnsible
  class AnsibleRole < ActiveRecord::Base
    self.include_root_in_json = false
    validates :name, :presence => true, :uniqueness => true
    validates :proxy_id, :presence => true
    has_many :host_ansible_roles
    has_many_hosts :through => :host_ansible_roles, :dependent => :destroy
    has_many :ansible_files, :dependent => :destroy
    belongs_to :ansible_proxy, :foreign_key => :proxy_id, :class_name => 'SmartProxy'

    scoped_search :on => :name, :complete_value => true

    def file_count(dirname)
      AnsibleFile.where(:dir => dirname, :ansible_role_id => id).count
    end
  end
end

