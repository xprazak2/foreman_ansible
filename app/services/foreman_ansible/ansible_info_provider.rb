module ForemanAnsible
  class AnsibleInfoProvider < HostInfo::Provider
    def host_info
      transformed = foreman_params.reduce({}) do |memo, (key, value)|
        memo[key] = value[:value]
        memo
      end

      { 'parameters' => transformed }
    end

    def resolve_values
      values = AnsibleVariable.where(:ansible_role_id => host.all_ansible_roles.pluck(:id)).
               values_hash(host).raw.values


    end

    def foreman_params
      values = resolve_values
      transformed = values.each_with_object({}) do |item, memo|
        item.map do |name, hash|
          variable = AnsibleVariable.find_by :key => name
          safe_value = variable.hidden_value? ? variable.safe_value : hash[:value]
          memo[name] = { :value => hash[:value], :safe_value => safe_value, :source => 'global' }
        end
        memo
      end
      transformed
    end
  end
end
