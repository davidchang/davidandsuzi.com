require 'net/http'

rootUrl = 'http://davidandsuzi.com'

result = Net::HTTP.get(URI.parse(rootUrl))

scriptRegex = /<script src="([\w\d.\/\-:]*)"><\/script>/

scripts = result.match scriptRegex

puts scripts.length

for script in scripts.captures
	puts script
end
