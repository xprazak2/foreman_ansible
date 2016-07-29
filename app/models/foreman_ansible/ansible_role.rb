# Simple model to store basic info about the Ansible role
module ForemanAnsible
  class AnsibleRole < ActiveRecord::Base
    self.include_root_in_json = false
    validates :name, :presence => true, :uniqueness => true
    has_many :host_ansible_roles
    has_many_hosts :through => :host_ansible_roles, :dependent => :destroy
    scoped_search :on => :name, :complete_value => true
  end
end

