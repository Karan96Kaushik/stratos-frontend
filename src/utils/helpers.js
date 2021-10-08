const sortHelpler = (state) => {

    // Don't update Page num to 1 on FIRST RENDER
    if(state.sortState.sortDir == -1 && state.sortState.sortID == 'createdTime')
        state.setSearch({...state.search, ...state.sortState})
    // If another sort state is set to neutral (0); revert to default sortState
    else if(!state.sortState.sortDir)
        state.setSortState({sortID:'createdTime', sortDir:-1})
    // reset to page 1 when sort state is changed
    else if(state.page != 1)
        state.setPage(1)
    // If page is reset to 1, search useEffect will automatically trigger
    else
        state.setSearch({...state.search, ...state.sortState})

}

const searchTextHelper = ( state, loadData, endpoint, navigate ) => {

    let queryParams = Object.assign({}, state.search)
    delete queryParams.filters

    navigate(endpoint + serialize(queryParams));
    if(state.search.text == "" || state.search.text?.length > 2 || !state.search?.text)
        loadData();

}

const useQuery = (useLocation) => {
	let entries =  new URLSearchParams(useLocation().search);
	const result = {}
	for(const [key, value] of entries) { // each 'entry' is a [key, value] tupple
		result[key] = value;
	}
	return result;
}

const serialize = (obj) => {
	var str = [];
	for (var p in obj)
	  if (obj.hasOwnProperty(p)) {
		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	  }
	return str.join("&");
  }

export { 
    sortHelpler, 
    searchTextHelper,
    serialize,
    useQuery
}