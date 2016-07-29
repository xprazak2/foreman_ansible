class AddColumnsToAnsibleRole < ActiveRecord::Migration
  def up
    add_column :ansible_roles, :created_at, :datetime
    add_column :ansible_roles, :updated_at, :datetime
  end

  def down
    remove_column :ansible_roles, :created_at
    remove_column :ansible_roles, :updated_at
  end
end
