require 'test_plugin_helper'

module ForemanAnsible
  class AnsibleRolesControllerTest < ActionController::TestCase
    setup do
      @role = FactoryGirl.create(:ansible_role)
    end

    test "should get index" do
      get :index, {}, set_session_user
      assert_response :success
      assert_template 'index'
    end

    test "should destroy role" do
      assert_difference('AnsibleRole.count', -1) do
        delete :destroy, { :id => @role.id }, set_session_user
      end
      assert_redirected_to ansible_roles_url
    end
  end
end
