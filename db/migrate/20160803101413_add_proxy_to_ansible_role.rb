class AddProxyToAnsibleRole < ActiveRecord::Migration
  def up
    proxy = SmartProxy.with_features('Ansible').first
    raise 'No proxy with "Ansible" feature found' if proxy.nil?
    add_column :ansible_roles, :proxy_id, :integer
    ForemanAnsible::AnsibleRole.update_all(:proxy_id => proxy.id)
    change_column :ansible_roles, :proxy_id, :integer, :null => false
    # remove_column :ansible_roles, :proxy_id
  end

  def down
    # add_column :ansible_roles, :proxy_id, :integer, :null => false
    remove_column :ansible_roles, :proxy_id
  end
end
