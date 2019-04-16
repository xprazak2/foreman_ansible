module ForemanAnsible
  module TemplateExtensions
    def acceptable_template_input_types
      super.concat [:ansible_variable]
    end
  end
end
