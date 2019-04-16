class AddAnsibleVariableTemplateInput < ActiveRecord::Migration[5.2]
  def up
    add_column :template_inputs, :ansible_variable_name, :string
  end

  def down
    remove_column :template_inputs, :ansible_variable_name
  end
end
