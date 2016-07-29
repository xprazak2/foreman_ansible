module ForemanAnsible
  module SmartProxyExtensions
    extend ActiveSupport::Concern
    included do
      has_many :ansible_roles, :class_name => 'ForemanAnsible::AnsibleRole'
    end
  end
end
