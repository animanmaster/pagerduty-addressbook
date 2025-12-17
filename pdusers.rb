require "json"
require "net/http"

class PagerdutyClient
  AVAILABLE_FILTERS = [ 'name', 'id' ]

  attr_reader :api_token, :api_base_url

  def initialize(api_token, api_base_url)
    @api_token = api_token
    @api_base_url = api_base_url
  end

  # @return [Enumerable<Hash>] List of users
  def users(query="")
    fetch_total = true
    limit = 50
    offset = 0
    total = 0
    done = false
    included = "#{URI.encode_uri_component("include[]")}=contact_methods"

    while !done do
      url = "#{@api_base_url}/users?limit=#{limit}&offset=#{offset}&#{included}&total=#{fetch_total}"
      response = json_to_map(http_get(url))
      users = response["users"]
      users.each { |user| yield user } if block_given?

      total = response["total"]
      offset += limit
      fetch_total = false
      done = !response['more']
    end
  end

  def find_by_id!(user_id)
    url = "#{@api_base_url}/users/#{user_id}"
    response_body = http_get(url)
    json_to_map(response_body)
  end

  private

  def http_get(url)
    uri = URI(url)

    request = Net::HTTP::Get.new(uri)
    request["User-Agent"] = "Mozilla/5.0"
    request["Authorization"] = "Token token=#{@api_token}"

    puts "\nSending 'GET' request to URL : #{url}"
    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http|
      http.request(request)
    }

    puts "Response Code : #{response.code}"
    response.body
  end

  def json_to_map(json_string)
    JSON.parse(json_string)
  end
end


DEFAULT_API_BASE_URL = "https://api.pagerduty.com"
DEFAULT_API_TOKEN = "y_NbAkKc66ryYTWUXYEu"

client = PagerdutyClient.new(DEFAULT_API_TOKEN, DEFAULT_API_BASE_URL)

if ARGV[0] == 'list'
  client.users do |user|
    puts "-----------------------------------"
    puts JSON.pretty_generate(user)
    puts "-----------------------------------"
  end
else
    puts "Usage: ruby pdusers.rb list"
end
