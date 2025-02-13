import React from "react"
import ReactCountryFlag from "react-country-flag"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Country {
  value: string
  label: string
  code: string
}

interface CountrySelectorProps {
  countries: Country[]
  selectedCountry: string
  onSelect: (country: Country) => void
}

export function CountrySelector({ countries, selectedCountry, onSelect }: CountrySelectorProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const selected = countries.find((country) => country.value === selectedCountry) || countries[0]

  const filteredCountries = countries.filter((country) =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start bg-[#0d1526] border-gray-700 text-white">
          {selected.code !== "XX" && (
            <ReactCountryFlag
              countryCode={selected.code}
              svg
              style={{
                width: "1.2em",
                height: "1.2em",
                marginRight: "0.5em",
              }}
              title={selected.label}
            />
          )}
          <span className="truncate flex-grow text-left">{selected.label}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-[#1E293B] border-gray-700">
        <div className="p-2">
          <Input
            type="text"
            placeholder="Buscar país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2 bg-[#0d1526] border-gray-700 text-white"
          />
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-[#283851] mb-1"
            onClick={() => onSelect(countries[0])}
          >
            <span className="truncate">Todos os países</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-[#283851]"
            onClick={() => onSelect(countries[1])}
          >
            <span className="truncate">Totalmente remoto</span>
          </Button>
        </div>
        <div className="border-t border-gray-700 my-2"></div>
        <ScrollArea className="h-[300px]">
          <div className="p-2">
            <h4 className="mb-2 text-sm font-semibold text-gray-400">Países específicos</h4>
            <div className="grid grid-cols-1 gap-1">
              {filteredCountries.slice(2).map((country) => (
                <Button
                  key={country.value}
                  variant="ghost"
                  className="justify-start text-white hover:bg-[#283851] h-9 px-2 w-full"
                  onClick={() => onSelect(country)}
                >
                  {country.code !== "XX" && (
                    <ReactCountryFlag
                      countryCode={country.code}
                      svg
                      style={{
                        width: "1.2em",
                        height: "1.2em",
                        marginRight: "0.5em",
                      }}
                      title={country.label}
                    />
                  )}
                  <span className="truncate">{country.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

