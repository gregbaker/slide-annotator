execute "apt-get-update" do
  command "apt-get update"
  ignore_failure true
end

package "python3-pip"
package "sqlite3"
package "redis-server"

execute 'pip' do
  cwd '/home/vagrant/server'
  command 'pip3 install -r requirements.txt --upgrade'
end

execute 'npm' do
  cwd '/home/vagrant/server'
  user 'vagrant'
  command 'npm install --save react react-dom babel-preset-es2015 babel-preset-react babel-cli jquery'
end

execute 'migrate' do
  user 'vagrant'
  cwd '/home/vagrant/server'
  command 'python3 manage.py migrate'
end

execute 'initial data' do
  user 'vagrant'
  cwd '/home/vagrant/server'
  command 'python3 manage.py loaddata initial_data.json'
end
