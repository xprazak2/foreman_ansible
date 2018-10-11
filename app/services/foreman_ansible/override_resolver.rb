module ForemanAnsible
  class OverrideResolver
    def initialize(overrides)
      @overrides = overrides
    end

    def resolve(ansible_variable)
      override = @overrides[ansible_variable.id]
      return {} unless override
      override[ansible_variable.key]
    end
  end
end
