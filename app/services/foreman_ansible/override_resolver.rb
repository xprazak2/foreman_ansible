module ForemanAnsible
  class OverrideResolver
    attr_reader :overrides

    def initialize(resource_id, resource_name, variables)
      @overrides = calculate_variable_overrides(resource_id, resource_name, variables)
    end

    def resolve(ansible_variable)
      override = @overrides[ansible_variable.id]
      return unless override
      override[ansible_variable.key]
    end

    private

    def calculate_variable_overrides(host_or_hg_id, resource_name, ansible_variables)
      return {} if !host_or_hg_id || !resource_name
      resource = resource_name.constantize.find host_or_hg_id
      return {} unless resource
      if resource.is_a? Host::Base
        ansible_variables.values_hash(resource).raw
      else
        hostgroup_values_hash ansible_variables, resource
      end
    end

    def hostgroup_values_hash(ansible_variables, hostgroup)
      ansible_variables.reduce({}) do |memo, ansvar|
        next memo unless ansvar.override
        hash_result = inherited_hostgroup_value(hostgroup, ansvar)
        next memo unless hash_result
        memo[ansvar.id] = {
          ansvar.key => {
            :value => hash_result[:lookup_value].value,
            :element => 'hostgroup',
            :element_name =>  hash_result[:hostgroup].name
          }
        }
        memo
      end
    end

    def inherited_hostgroup_value(hostgroup, ansvar)
      return unless ansvar.path_elements.flatten.include?("hostgroup") || Setting["host_group_matchers_inheritance"]
      hostgroup.path.reverse.reduce(nil) do |memo, hg|
        break memo if memo
        value = LookupValue.find_by(:lookup_key_id => ansvar.id, :id => hg.lookup_values)
        next memo unless value
        { :lookup_value => value, :hostgroup => hg }
      end
    end
  end
end
