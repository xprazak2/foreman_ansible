# frozen_string_literal: true

FactoryBot.define do
  factory :ansible_role do
    sequence(:name) { |n| "ansible_role_#{n}" }
  end

  factory :host_ansible_role do
    sequence(:position)
    host_id { nil }
    ansible_role_id { nil }
  end

  factory :hostgroup_ansible_role do
    sequence(:position)
    hostgroup_id { nil }
    ansible_role_id { nil }
  end
end
