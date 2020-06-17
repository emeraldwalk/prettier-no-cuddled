const SomeComponent = () => {
  return (
    <div>
      <input
        onChange={onChangeChecked((checked) =>
          dispatch('toggleAllMeasureFilters', checked)
        )}
      />
    </div>
  )
}
