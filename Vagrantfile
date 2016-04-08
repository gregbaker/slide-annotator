# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "ubuntu/wily64"
#  config.vm.box = "ubuntu/xenial64"

  config.vm.synced_folder "./", "/home/vagrant/server"
  config.vm.network "forwarded_port", guest: 8000, host: 8000

  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = "./chef-cookbooks"
    chef.add_recipe "setup"
  end
end
