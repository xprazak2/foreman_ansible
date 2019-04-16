module InputResolver
  class AnsibleVariableInputResolver < Base
    def ready?
      @scope.host && host_variables.key?(@input.ansible_variable_name)
    end

    def resolved_value
      host_variables[@input.ansible_variable_name]
    end

    private

    def host_variables
      @variables_hash = ForemanAnsible::AnsibleInfo.new(@scope.host).ansible_params
    end
  end
end
