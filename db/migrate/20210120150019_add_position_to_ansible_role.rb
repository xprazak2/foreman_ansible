class AddPositionToAnsibleRole < ActiveRecord::Migration[6.0]
  def change
    add_column :host_ansible_roles, :position, :integer
    add_column :hostgroup_ansible_roles, :position, :integer

    update_hostgroup_ansible_roles
    update_host_ansible_roles
    change_column_null :host_ansible_roles, :position, false
    change_column_null :hostgroup_ansible_roles, :position, false
  end

  def update_host_ansible_roles
    hosts = Host.unscoped.where(:id => HostAnsibleRole.pluck(:host_id).uniq)
    hosts.each do |host|
      host.host_ansible_roles.each_with_index do |har, idx|
        har.position = idx
        har.save!
      end
    end
  end

  def update_hostgroup_ansible_roles
    hostgroups = Hostgroup.unscoped.where(:id => HostgroupAnsibleRole.pluck(:hostgroup_id).uniq)
    hostgroups.each do |hg|
      hg.hostgroup_ansible_roles.each_with_index do |har, idx|
        har.position = idx
        har.save!
      end
    end
  end
end
