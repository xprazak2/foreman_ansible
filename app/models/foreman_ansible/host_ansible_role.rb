# Join model that hosts the connection between hosts and ansible_roles
module ForemanAnsible
  class HostAnsibleRole < ActiveRecord::Base
    audited :associated_with => :host, :allow_mass_assignment => true

    belongs_to_host
    belongs_to :ansible_role, :class_name => "ForemanAnsible::AnsibleRole"

    validates :ansible_role_id, :presence => true,
                                :uniqueness => { :scope => :host_id }
  end
end
