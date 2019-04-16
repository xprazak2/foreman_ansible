module ForemanAnsible
  module TemplateInputExtensions
    def self.prepended(base)
      base::TYPES.merge!(:ansible_variable => N_('Ansible variable'))
    end

    def ansible_variable_input?
      input_type == 'ansible_variable'
    end

    def get_resolver(scope)
      return InputResolver::AnsibleVariableInputResolver if ansible_variable_input?
      super scope
    end
  end
end
