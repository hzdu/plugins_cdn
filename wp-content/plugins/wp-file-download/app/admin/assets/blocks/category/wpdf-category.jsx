(function (wpI18n, wpBlocks, wpElement, wpEditor, wpComponents) {
  const {__} = wpI18n
  const {Component, Fragment, React} = wpElement
  const {registerBlockType} = wpBlocks
  const {TextControl, Spinner, Icon} = wpComponents

  let fetchingQueue = null
  let categoriesDropdown = null
  const previewImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACrCAYAAABPPoFvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAEqpJREFUeNrsnVtsHFcZx89c1rv2+pbEjuME59omrdsUkSKhUvpQKlSJCFBfgF4iHkAgkNoHFCmICPFWxEsVXpCqIkJFiwSoqJUQFVVbGioVKkpDFapEOClNiuVc7Pq+u7Z3Z5hvvOPMjue2s2dmzuz+f9Jknb3N7JnzP+c73/nOdxgDAAAAAAAAAAAAAAAAAAAAAAAAAACgg5DCvlFV1UifAwBwQad/qtVqPEKvC1wK+Rk0AABwEHSI5/VmRC+FFLib0CUIHIBExK57PIYWvBSyB5ccApcgdAASEbv90X5seo+f4NWAXtz6W3YIXELPDkAiPbnfYb1HCjD7G4Xu0WtLNqGHFTwAgE9vbj80l8eN91NH7dWrq47e3E3ssnW89dZbn969e/cxRVH2G//PQeAAxIZWq9Wml5aWzjz44IO/vnz5crWuNa3+WKvrUnP07LrvGN0Qul3g9h5cOXHiRP/jjz/+00Kh8Fj9OQBAQhi99Lnnnnvua8ePH79aF7hme9RsPbw1Vt8kdsUxNnf24srQ0JB6+vTpU4bIj6H3BiB5ZFkeueOOO+7p7e195cyZM+WAcT29n2ma1vicz9jcFPuzzz57uyHyR1DcAKRHLpf71EMPPfTl+nBbsQ+pbRa4d2PhYsbbP6yMj4/DXAcgfaTh4eGH60J3it1tyttT6M6e3fySrq6ucZQxAOljaPE2l97cLabFLT5Gdb5BdvxdQBEny+rqKtN13fSdGDf35mDMeG5lZaVh/GUMq8wxmQVNr9DnN26qJJnvoUeLtbU187CP6eg9fueh67Cvd6DXKpVKw3V3d3c3dR6iXC6b52vmPM7fXKvVzOv1Ow99h/33OMuWKJVKDf/P5/NMURTPsiV6enoa/k/XQddjQZ+n7/E7j/M323+PYbJv/FajbPN1odudcJbn3dKsq9dd9TITbC0GSBiqpH19fa6veT3PmzDn6e/vb/k8vb29wpwnzHuSPA81gsvLyw2NmjWkZjen1wLNdrvp7hUoIxmtLTztAIhDUPCaFLZHl8K2EiC+Hh2Iid0s5wENdRw9dsPQgYYLjqmycMJ2RMmpzDtmHUIHwMH09PQmn0ErDAwMsMHBwabahmZ6cq8ePbSwNWPIv2K0NDrufes9uNGiy2hSMwE5F50OuVZwBrY0IfZmnvd0xrGgMfrE8gr79rsfscVqDXe/RZ45MsbuHuxBQWQIminQtBrTI/R0skzmuhLZ2g9hdW/yvqvNtAogGajHoGkVIC40/TUx8Z9IqZ22bNnC9u7dF8p6oMM+xeeh0eBMUaIVYI8qG1ctsTXDpFnVOnNgENGcA4n26Jo5Hx7FjKd4g7D1gA4XoTeNcEJ/5+gRljfGrL+YmGJPnZ9cbz1rqPhALFQ1x3bs2BHJC18s9iZ/vaIW5LduHTUP4tCL/2BdisSeuecgGx8opnpd33/nEvvL1TnU9A6HhlZ79uzNTsOUlQslc76oKqw/p6RbYFL8LgyveVXQWVA94FUXhBP64lqNrcqNY/P1FfU6W67WzNfTpKrH7zdwxmADcSgWi1wdpc44eKfVQAcPn41wQv/Mn866Pl+q6uzRNy+gpoFUIY95Jq0D3DoAOmAYgCIQD11HvCHgS2TTXZEYG8jJ5iNo8SY4HHwUjOEcp9M0Ttzz69TASBJuqLPBjatMaH7cz9lG9YAOHj6ByEIf6+5iP7vrEwzR7q2zsxB8Iz/++GMmSwrVutiuY2WlzPL5btyQOmurq0xWjM5MiceV1dPTzbq7k1mpGPkX5GWJ7SvCO5wU1Jt35eOtFEa1ZqqiorAtK0quMkVWYyuTJKdRMUZvY96ZrbE3blRREICh+Rbxpqit35Z/zdXYbz9aZavGsP7ebSrLoUnPZD3gURdaEvp60r4VXw9xsdjDJSC/E8xyeznyuLlzazob6pLZQE4S0mF61miInjhb9n3Py/cVWcG4+LdnqubvObJFYaMF8VusX364yk7/N3ixy0/uVtjR3d7DX9IOHakGzNDJl5dLAUIvIpwzBFSGvKfU3rheZeWazvYWVSGTWixXdXZu3j/K0bh8c2x5cUljvzLE84fPFjNxP69XtMDfRsyvJefI5mIXkKALhfVQvlKpbGavBOky3q+wvhxjXxgRc137dqNnfmS3vzPXMEjMRuobe7vYw8Z7uzLSZxweUAJ/G7GnR86W0NczZmzknnZ9z7G/LbHFBFuwzxsV/IlD2UyySHPmrc6dfnVM7MQVB3tl9vMj4afyujJkGB4dzZlHEIVuJdBq5hU7wUXoVCmtHt1rIf4Zw5ScWUluXflIIbtDBsoqgkywwMowk2rAjLPlqdWTQyA7SqyjeRZnpi8dwU8u5dEeZcJF6AsLi2xxcWm9cHR3of/4zm5WqSVXaLf1t5+3X9NrLN6Ufnr9HGC9LlN5aLGVSbW6xvL5ruwIPUwv/s0DedScFgmbayy6qbiaWEhmNoSubawJj4MkE4BGFrokWRvZ6f49BEz5UD2HHYzPAeGxU0uyQlcUmfX1Bc9r8t7CBgCQkunu1kPRtjU1n+ytc3OzDVvddjI7d+7kYpZT/IJfDAP1EBTzkAZB1xaFrVu3Cnk/5+fnQ3VwtEssjx1cUxQ63dgV3+T2V658ZBQIsqkSlJ6Ih9Cpgk1NTXm+vm3bttSEHnRtUctNxPXzk5OToTqxPXv2ZFvodsi5Y405SfiWd97OtJ5nCzpfxwTd/p1ymeVZ9oYOrcydipw4opOSWoT5rUHv8dmpRTyhU8RcLqdumPRuvFQdY6/WdnA9b45p7Edd59it8mLmKklUvwZtKECHiIh8bbwZHx8PV0cDGvMM7tSC9EQApEkiPbq17NJrmqBfWmM7pArnH6axnISpPQASETotZS2XK76m+xfVSfaAcpXzmXWzAWmX8R09xysJgRdkIsZ9jixhrQePq0yCxuj0Oi+/Rux3NcwKnCKrsqKElEcWXrt3xD0dSc5STHnehBxhceQKsFu7frMtlAmYrkHYnVqoEVJVhflFzQ0NbTMz0IDwWzDFPTVGKw/Tmn4TETMhp3Fv/LZN6mjTncyN/v4+3/ds3boFNQkA0YVOU0ALC0u+Zg2Jeb1nB0FlaS9H7NQChBE6VUYa0wVVSuz8Ec4CspcjmdBRdlS9ceMGu379uufrg4ODbNeuXak3ahcuRN8sk8a0+/fvF/p+TkxMeCZgsUNxBRSt6DeUEipghsx0y6mwvLzMlpaWod4WiNqjkyNtYWHB83VRVsX5XWOYcbPoLC0tmWs9ggiK1TfXw4sUMEOLV6y4dq+FLF/56yJbWEvPJD1+ezc7ujPX1g0EOdJGRkY8X+/r6xPCevG7xiCy4BgbGhoye+IgenqSc0ZzcsbZpyDcxXx2tpZozrhNZm2l/YNnaJGH6Pt305SS6KZ3q4yNjbXPGN3ZylpTZTQGswJkQDSSzDwCxEWInVrszM7OmYcfT36ScsalV2j3DGUn4gu72wCrHqS+U4vTaRDEY3uRM67VMqatk+OcxSiVSihoG+TcJKdaXCGw9L1J+U0i/4L18L0gLy5yxvFqKEngcUetkUM1SQdRVsznKFOdYb9b+DE6Cb23Fznj4gCNI7DqAa+6gB0QBSRMsAVof6wMMxA6ACBe0x2Ix9WrV83DC4rE2r17d+rXST6J9957r+nPbd++3cyYKzrnz58PtdyX7sXo6CiEDpoXkN+YTqTFMlHGnllZ7BN2bJ3k74HQBSSql3dgYMD3s6KEj9IMAqU6bpas7GBDVkcYoVNe96B6wMtfA6ELiLXXfLPQ1FhWpsf8Vm1lnbBhyEHTa9QgUl3g4XmHMw6ADgA9eobG38gZlyxx54yj8k4qdReELiBUAZwLW9bTc/XHel4Kbor7HFmCyjzNnHF0P+jgEfYM011QoQNA9YBXXYDQAcAYHWQJmorxm44hL29SU1Q0rqVtkpOK26ehjijTh5ROLcy4nq43qdwDELqgY8MoUGJI2rLXi+Hh4cSyu5DAL126lNjSV4qa27dvnxD37+LFi6FyxlEsgd/Gk5naqQU0Tys9k0iRcUGRerzPJQq8IuOE36kFpAMFavg1EklGllGgB+VOS8qxKFLUHPXUYZZn9/b2YowOmofmZEXZUolMTtETVcZFUBrnNIDXXUCwUwuA0DsAJJ4AVj3AopYO69HpOfKqx5kckjzFCNZpFJqViTWWcbOq+g5veIbfQugZgQROy1DjBiGwN6GpwXZJDgnTHQCM0UEaYAMHYNUDXnUBpruARA2LpF08KfzSC5prTsL8D+sPmJ+fb6rS0+aFWWB6ejrUPDptY+03VLK2ZELADGhgcXGRTU1Neb5OWV1EErpfuK4TCgTKitCvXbsWal0/iTgpnwhMdwA6APToAhLVVKOFHX69XtRcdHFAPdnhw4fb8v4dPHgw1PuCvPmYXmtzaP42ysKWOOd8uZuSRqMjUsPDk7A+lqB7ZQXM8FjKCtMdAJjuQBRoe10/jzoPqIeJ+xxZg+f+Z04oNXdSFhiEnhG6u7vNAwCY7m1CXCGXIHv1gFddgNBFbH1l3BbAN5UUahQAMN0BABA6iAWsCQeEtVMLhA6hgzavB9ipBQAAoQMAIHShiTMvHMhWPcD0WhuDgBlA0GIWXnuzQejo0QF6dAAAxugAAAgdRCNMvjHQ/vDcqQVCFxDsvQasesCrLkDoAHQASDzRxszMTHPJCZ4WfX39Zi56nqGgSUFTpCItN4bQBYRXeqHXXnuNlcvlzJbDvfd+jt1yyy1mvvqZmZlMXfuuXbtazgiEnVraHF5BEjxXP6U1RnX7u2PMbezUAsLwwAMPZNp0HxgYrJvwfaYJnyWipOuG6Q4isX37SFv1bCA68LoLSJZ7YcB36IKdWtoYyiMugun3g39OsqogY+P7RnrZju4c+/2Hs7Gep0eV2fcODZvnShsKlqG6wMOagdAFbclF4I//m2crNTGsiy1dinEtOnvpylzM51HZY/u3GUJvr7oAoYNQDOQUNphPdl+3mUqVLVXdG5pBQ/gDXfyu54ZxrlK1fYdMEDoIxZfGBtl3DiW7P/mT566ylw2rwo2v79vKHt2/ldu5fvjuJHvz2hKEDhK8KQJ6mIs5OfFxa7fi7SvuNSwMntdTUGQh6wGvugChQ+ih+HBphb06tZjoOadK3iu3Li5UuF7P9Yp4IbZWZBwCZkBi/HlywTxE4cUrc+YBwoF5dAA6wUpEEYiHKAEzJ+4cYTVBQszHBwvmFNvJu0ZjPU9BkdhwQQxZ0NQar7oAoQsIBUqIEDBz7MA24crm1v5CR9UDCpjhscgJpjsAGKMDACB0EAvI6w6seoC87m0MdmoBBHZqQY8O0KND6AAACB0ACB2kD82dAkD1gFddgNAFJMuZWwE/KCoOkXFt3pJTLnNauWT3ulJIJEVL2bOOODcKcNvswPke+n57Y0IOH3skntt5nEsmqQI69wULcx56j93BRPvMtXoeOoe95wtzHmfZEpVKpeH/9Lo9r7pb2VK52c9D12oXJ12nfRaFrsG5t57zN1u/hw5ezjgIXUCspYl0BJluzsoZ9T2lUsn39TAb/oU5T9CGEkmdJ0zZhtnsMsx5gnaZ8frNvDZvgOkOQIcAoQMAoQMA2lXo2JwbALHRm9WsHOLLMNcDgBjUbLrUbUdgZy0HtRTLy8v/RvkCkD7lcvl8kz29q9B1x9/m8frrr//OeMRmYACkbK5/8MEHL9R1qbn06HqQ6e5m728cx48fn5idnX0B5QxAepRKpXNPP/30Kx6m+yaRO+fuFVuEkeQ46AV5bW1NunDhwt/vv//+4Z6entvrrwEAkjPZL5w8efK7zz///I36OJ2Oqu1vzXaYoneGzlpC3yTw+kH/VwyTofb++++/feDAgUvFYjGXz+dHJUlCVB0Acdnpul6rVCoXL1++/JtTp049dfr06Ws2YdvFrrmZ8k6hm72zqqp2kSv1R7V+5OqHWn9Nsb1Htn8PAICf1m2HU9x0rNUPu+Atr7xumO4N5rzq8+Wa7cOyi5g1x/MQOwB8BO6mRWdvrrn05sxrzK76tCT2L6q6vCZD6ADEJnRmE7EWMDb3m1NvELpzak2rC7fmchGazXSXIHQAYjPbmcOy1lyEbp9u82RDnLZxutMppzgerb8llzE6xA5AfKa7U/RuvTpzjs+dprvuMgZ3tjCW0DVHowCRAxCf2DWfI1TgTIM46706c+nZ3R4hdACS7dWdj5sccV5JLty87pKLQ0CyvYbeHIB0xO4m/A38MtlsEmg9d5XkMvaWXP4PkQMQv9CZh4ne4ERvSuguZryX8J2fh+AB4CtyL8GzMOY6CytOR+/u9RkIHID4Be/aAIQReVMi9RA9g+gBiFXczDEOj5QBqmVh2vNRAwD4Eba3BgAAAAAAALQN/xdgAJ6GwUPVcZ0xAAAAAElFTkSuQmCC';
  const categoryIcon = (
    <svg className="dashicon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z"/>
      <path
        d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zm-5.55-8h-2.9v3H8l4 4 4-4h-2.55z"/>
    </svg>
  )
  const folderIcon = (
    <svg className={"dashicon"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  )
  const loadingIcon = (
    <svg className={'wpfd-loading'} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <g transform="translate(25 50)">
        <circle cx="0" cy="0" r="10" fill="#cfcfcf" transform="scale(0.590851 0.590851)">
          <animateTransform attributeName="transform" type="scale" begin="-0.8666666666666667s" calcMode="spline"
                            keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="2.6s"
                            repeatCount="indefinite"/>
        </circle>
      </g>
      <g transform="translate(50 50)">
        <circle cx="0" cy="0" r="10" fill="#cfcfcf" transform="scale(0.145187 0.145187)">
          <animateTransform attributeName="transform" type="scale" begin="-0.43333333333333335s" calcMode="spline"
                            keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="2.6s"
                            repeatCount="indefinite"/>
        </circle>
      </g>
      <g transform="translate(75 50)">
        <circle cx="0" cy="0" r="10" fill="#cfcfcf" transform="scale(0.0339143 0.0339143)">
          <animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline"
                            keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="2.6s"
                            repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>
  )

  class WpfdCategoryEdit extends Component {
    constructor() {
      super(...arguments)
      this.state = {
        categoriesList: [],
        searchText: '',
        selectedCatName: '',
        selectedCatId: '',
        showCategoryList: false,
        isManagingFocus: false,
        showInput: false,
        loading: true,
        error: false,
        preview: false,
      }
      // this.categoriesDropdown = this.categoriesDropdown.bind(this)
      this.searchCategoryHandle = this.searchCategoryHandle.bind(this)
      this.fetchCategories = this.fetchCategories.bind(this)
      this.setSelectedCategoryId = this.setSelectedCategoryId.bind(this)
      this.handleClickOutside = this.handleClickOutside.bind(this)
    }

    componentDidMount() {
      const {shortcode, selectedCatName, isPreview, selectedCategoryId} = this.props.attributes
      if (isPreview) {
        this.setState({preview: true})
      } else {
        document.addEventListener('mousedown', this.handleClickOutside)

        // this.fetchCategories(false);

        if (shortcode) {
          this.setState({showInput: false, searchText: shortcode, selectedCatName: selectedCatName})
        }
      }

      if(typeof(selectedCategoryId) != 'undefined') {
        this.initLoadCategories(selectedCategoryId);
      }
    }

    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside)
    }

    componentDidUpdate(prevProps) {
      const {categoriesList, showCategoryList, searchText} = this.state
      const {attributes} = this.props
      const {selectedCategoryId} = attributes
      const self = this

      if (categoriesList.length === 0 && showCategoryList) {
        this.fetchCategories()
      }
      jQuery(document).ready(function() {
        var wpfd_tree = jQuery('.wpfd-foldertree');
        if(wpfd_tree.length) {
          wpfd_tree.each(function () {
            var curTheme = jQuery(this).closest('.wpfd-content').find('.wpfd_root_category_theme').val();
            var wpfd_topCat = jQuery(this).parents('.wpfd-content-'+curTheme+'.wpfd-content-multi').data('category');
            jQuery(this).jaofiletree({
                script: `${ajaxurl}?juwpfisadmin=false&action=wpfd&task=categories.getCats`,
                usecheckboxes: false,
                root: wpfd_topCat,
                expanded: false
            });
          })
        }
        var wpfd_subcategory = jQuery('.wpfd-content a.wpfdcategory');
        if (wpfd_subcategory.length) {
          wpfd_subcategory.each(function () {
            var curTheme = jQuery(this).closest('.wpfd-content').find('.wpfd_root_category_theme').val();
            jQuery(this).addClass(curTheme+'_category');
          })
        }
        if(jQuery('.wpfd-category-block').length && !jQuery('.categories-dropdown').length) {
          jQuery('.wpfd-category-block').removeClass('wpfd-category-block-selected');
        }
      });
    }

    handleClickOutside(event) {
      const domNode = this.categoriesDropdown
      const {shortcode} = this.props.attributes

      if (!domNode || !domNode.contains(event.target)) {
        this.setState({showInput: false, showCategoryList: false})
      }
    }

    static checkAttrChanged(prevAttrs, curAttrs) {
      const {
        selectedCategoryId: prevSelectedCategoryId,
      } = prevAttrs
      const {selectedCategoryId} = curAttrs

      return (
        selectedCategoryId !== prevSelectedCategoryId
      )
    }

    initLoadCategories(id) {
      if (parseInt(id) !== 0) {
        const {setAttributes} = this.props;
        const wpfdCategoriesHTML = `${ajaxurl}?action=wpfd&task=category.preview&wpfd_category_id=${id}`
        fetch(wpfdCategoriesHTML)
        .then(res => res.json())
        .then(
          (result) => {
            if (result.status) {
              setAttributes({
                catPreview: result.html 
              });
            }
          },
          // errors
          (error) => {
          }
        );
      }
    }

    fetchCategories(showList = true) {
      const self = this
      const wpfdCategoriesUrl = `${ajaxurl}?action=wpfd&task=categories.listCats`

      if (fetchingQueue) {
        clearTimeout(fetchingQueue)
      }

      if (this.state.error) {
        this.setState({error: false})
      }

      fetchingQueue = setTimeout(function () {
        if (!self.state.loading) {
          self.setState({loading: true})
        }
        fetch(wpfdCategoriesUrl)
          .then(function (response) {
            return response.json()
          })
          .then(function (response) {
            if (!response.success) {
              self.setState({
                loading: false,
                error: true,
              })
            } else {
              self.setState({
                categoriesList: response.data,
                loading: false,
                showInput: showList,
                showCategoryList: showList,
              })
              if(jQuery('.categories-dropdown').length) {
                jQuery('.categories-dropdown').closest('.wpfd-category-block').addClass('wpfd-category-block-selected');
              }
            }
          })
          .catch(function (error) {
            self.setState({
              loading: false,
              error: true,
            })
          })
      }, 500)
    }

    setSelectedCategoryId(id, catname) {
      const {setAttributes} = this.props
      // const {selectedCategoryId, shortcode} = attributes
      const shortCode = `[wpfd_category id="${id}"]`

      setAttributes({selectedCategoryId: id, shortcode: shortCode, catName: catname})

      this.initLoadCategories(id);

      this.setState({selectedCatId: id, showCategoryList: false, searchText: shortCode, selectedCatName: catname, showInput: false})
    }

    searchCategoryHandle(event) {
      const searchText = event.target.value
      this.setState({searchText: searchText, showCategoryList: true})
    }

    searchCategoryRecursive(category, categoriesIds, results) {
      if (typeof (results) === "undefined") {
        results = [];
      }

      if (!category || typeof (category) === 'undefined') {
        return results;
      }

      results.push(category);

      if (parseInt(category.parent) !== 0) {
        results = this.searchCategoryRecursive(categoriesIds[category.parent], categoriesIds, results);
      } else {
        results = this.searchCategoryRecursive(categoriesIds[category.parent], categoriesIds, results);
        results = results.reverse();
        return results;
      }
    }

    render() {
      const {categoriesList, searchText, selectedCatName, showCategoryList, showInput, loading, preview} = this.state
      const {attributes, className} = this.props
      const {shortcode, selectedCategoryId, catName, catPreview} = attributes
      let filteredCategoriesList;
      let categoriesIds = [];
      let filterCategoryResults = [];

      filteredCategoriesList = categoriesList.filter(category => {
        if (typeof searchText === 'undefined') {
          return true;
        }
        if (searchText.toLowerCase().indexOf('wpfd_category') >= 0) {
          return true
        }
        return (category.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0)
      })

      // Search tree category handle on searching key exists
      if (filteredCategoriesList.length && searchText !== '') {
        // Index categories list with term_id
        categoriesList.map((lCategory, lIndex) => {
          if (!lCategory || !lCategory.term_id) {
            return;
          }

          categoriesIds[lCategory.term_id] = lCategory;
        });

        // Search Filter in deep
        let insertedCategoriesIds = [];
        filteredCategoriesList.map((fCategory, fIndex) => {
          if (typeof (fCategory) === "undefined") {
            return;
          }

          let queueSearchFilters = [];

          if (fCategory.parent && parseInt(fCategory.parent) !== 0) {
            queueSearchFilters = queueSearchFilters.concat(this.searchCategoryRecursive(fCategory, categoriesIds, queueSearchFilters));
            filterCategoryResults = filterCategoryResults.concat(queueSearchFilters);
          }
        });

        filterCategoryResults.map(insertedCategory => {
          if (typeof (insertedCategory) === "undefined") {
            return;
          }

          if (typeof (insertedCategory.term_id) === "undefined") {
            return;
          }

          insertedCategoriesIds[insertedCategory.term_id] = insertedCategory;
        });

        filteredCategoriesList.filter(isSearchCategory => {
          if (typeof (isSearchCategory) === 'undefined') {
            return;
          }

          if (parseInt(isSearchCategory.parent) === 0 && !insertedCategoriesIds.hasOwnProperty(isSearchCategory.term_id)) {
            filterCategoryResults.push(isSearchCategory);
          }
        });

        filterCategoryResults = filterCategoryResults.filter(resultCategory => {
          return(typeof (resultCategory) !== 'undefined');
        });
      } else {
        // Search on init
        filterCategoryResults = filteredCategoriesList;
      }

      return (
          preview ?
              <img alt={__('WP File Download Category', 'wpfd')} width='100%' src={previewImageData}/>
              :
              <div className={className}>
                <div className="wpfd-category-block">
                  <div className="wpfd-category-search">
                    <label htmlFor="wpfd-category">
                      <Icon icon={categoryIcon}/>{__('WP File Download Category', 'wpfd')}
                    </label>
                    {
                      showInput ?
                          <Fragment>
                            <textarea
                                type="text"
                                value={searchText}
                                className="editor-plain-text input-control"
                                id="wpfd-category"
                                placeholder={__('Search for file category…', 'wpfd')}
                                onChange={this.searchCategoryHandle}
                            />
                            {showCategoryList &&
                            <div className="categories-dropdown" ref={(elm) => this.categoriesDropdown = elm}>
                              {loading ?
                                  <div className={'wpfd-loading-wrapper'}>
                                    <Icon className={'wpfd-loading'} icon={loadingIcon}/>
                                  </div>
                                  :
                                  <ul>

                                    {categoriesList.length > 0 ?
                                        (filterCategoryResults.length > 0 ?
                                                filterCategoryResults.map((category, index) => {
                                                let haveChild = (typeof (categoriesList[index + 1]) !== 'undefined' && categoriesList[index + 1].level > 0 && categoriesList[index + 1].level > category.level)
                                                let paddingLeft = category.level * 12
                                                if (!haveChild) {
                                                  paddingLeft += 14
                                                }
                                                let selectedClass = ''
                                                if (selectedCategoryId === category.term_id) {
                                                  selectedClass = 'active'
                                                }
                                                return (
                                                    <li
                                                        key={index}
                                                        className={`wpfd-category cat-lv-${category.level} ${selectedClass}`}
                                                        style={{paddingLeft: paddingLeft + 'px'}}
                                                        data-id-category={category.term_id}
                                                        data-id-parent={category.parent}
                                                        data-cloud-type={category.cloudType}
                                                        data-level={category.level}
                                                        onClick={() => this.setSelectedCategoryId(category.term_id, category.path)}
                                                    >
                                                      {category.level < 16 && haveChild &&
                                                      <span
                                                          className={'wpfd-toggle-expand'}
                                                      />
                                                      }
                                                      {category.cloudType === category.term_id || category.cloudType === false
                                                          ? <Icon icon={folderIcon}/>
                                                          : <i className={category.cloudType.toString().replace('_', '-') + '-icon'}/>
                                                      }

                                                      <span className={'wpfd-category-name'}>
                                                        {category.name}
                                                      </span>
                                                      {category.cloudType === false &&
                                                      <span className={'wpfd-category-count'}>
                                                        {`(${category.count})`}
                                                      </span>
                                                      }
                                                    </li>
                                                )
                                              })
                                        :
                                              <li>{__('No file category found with this name…', 'wpfd')}</li>
                                        )
                                    :
                                        <li>{__('No category found!', 'wpfd')}</li>
                                    }
                                  </ul>
                              }
                            </div>
                            }
                          </Fragment>
                          :
                          <Fragment>
                            <textarea
                                value={shortcode}
                                className="editor-plain-text input-control"
                                id="wpfd-category"
                                placeholder={__('Click here to select a category', 'wpfd')}
                                onFocus={() => this.setState({
                                  showCategoryList: true,
                                  showInput: true,
                                  searchText: '',
                                  loading: true,
                                  selectedCatname: '',
                                  categoriesList: [],
                                })}
                                onBlur={() => this.setState({
                                  showCategoryList: false,
                                  showInput: false,
                                  loading: false,
                                  searchText: shortcode,
                                  selectedCatName: catName,
                                  categoriesList: [],
                                })}
                                onChange={() => {
                                }}
                            />

                          </Fragment>
                    }
                  </div>
                  {catName !== '' && selectedCategoryId && showInput === false && 
                  <div className="wpfd-selected-category" dangerouslySetInnerHTML={{ __html: catPreview || '' }} />
                  }
                </div>
              </div>
      )
    }
  }

  class WpfdCategorySave extends Component {
    render() {
      const {attributes, className} = this.props
      return (
        <div className={className}>
          {attributes.shortcode}
        </div>
      )
    }
  }

  registerBlockType('wpfd/wpfd-category', {
    title: __('WP File Download Category', 'wpfd'),
    description: __('Showing WP File Download Category.', 'wpfd'),
    icon: {
      src: categoryIcon,
      foreground: undefined,
    },
    category: 'wp-file-download',
    keywords: [
      __('wpfd', 'wpfd'),
      __('category', 'wpfd'),
      __('file category', 'wpfd'),
      __('wp file download', 'wpfd'),
      __('download', 'wpfd'),
      __('file', 'wpfd'),
      __('wpfd category', 'wpfd'),
      __('wpfd folder', 'wpfd'),
      __('folder', 'wpfd'),
      __('wpfd file', 'wpfd'),
    ],
    example: {
      attributes: {
        isPreview: true
      }
    },
    attributes: {
      isPreview: {
        type: 'boolean'
      },
      selectedCategoryId: {
        type: 'number',
      },
      shortcode: {
        type: 'string',
      },
      catName: {
        type: 'string'
      },
      className: {
        type: 'string'
      }
    },
    edit: WpfdCategoryEdit,
    save: WpfdCategorySave,
  })

})(wp.i18n, wp.blocks, wp.element, wp.editor, wp.components)
