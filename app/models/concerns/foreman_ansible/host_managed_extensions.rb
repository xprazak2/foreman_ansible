module ForemanAnsible
  # Relations to make Host::Managed 'have' ansible roles
  module HostManagedExtensions
    extend ActiveSupport::Concern

    included do
      has_many :host_ansible_roles, :foreign_key => :host_id, :class_name => 'ForemanAnsible::HostAnsibleRole'
      has_many :ansible_roles, :through => :host_ansible_roles,
                               :dependent => :destroy, :class_name => 'ForemanAnsible::AnsibleRole'
      attr_accessible :ansible_role_ids, :ansible_roles
    end
  end
end
