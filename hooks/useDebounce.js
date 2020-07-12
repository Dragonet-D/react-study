function useDebounce(value, delay) {
  const [debounceValue, setDebounceValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value)
    }, delay)

    return () => {
      clearTimeout(timeout)
    }
  }, [value, delay])

  return debounceValue
}

function App() {
  const [value, setValue] = useState('')

  const debounceValue = useDebounce(value, 500)

  useEffect(() => {
    if (!debounceValue) return
    console.log(debounceValue)// 500s 之后打印
  }, [debounceValue])

  return (
      <div>
        <input type="text" onChange={e => setValue(e.target.value)}/>
      </div>
  )
}

function useDebounce1(value, delay) {

  const [debounceVal, setDebounceVal] = useState(value)

  useEffect(() => {

    const timer = setTimeout(() => {
      setDebounceVal(value)
    }, [delay])

    return () => {
      clearTimeout(timer)
    }

  }, [value, delay])

  return debounceVal
}