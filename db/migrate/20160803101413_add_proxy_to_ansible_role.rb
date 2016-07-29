class AddProxyToAnsibleRole < ActiveRecord::Migration
  def up
    # add_column :ansible_roles, :proxy_id, :integer, :null => false
    remove_column :ansible_roles, :proxy_id
  end

  def down
    # add_column :ansible_roles, :proxy_id, :integer, :null => false
    # remove_column :ansible_roles, :proxy_id
  end
end
