module ForemanAnsible
  class OverrideResolver
    def initialize(resource_id, resource_name, variables)
      @overrides = calculate_variable_overrides(resource_id, resource_name, variables)
    end

    def resolve(ansible_variable)
      override = @overrides[ansible_variable.id]
      return {} unless override
      override[ansible_variable.key]
    end

    private

    def calculate_variable_overrides(host_or_hg_id, resource_name, ansible_variables)
      return {} if !host_or_hg_id || !resource_name
      resource = resource_name.constantize.find host_or_hg_id
      return {} unless resource
      ansible_variables.values_hash(resource).raw
    end
  end
end
