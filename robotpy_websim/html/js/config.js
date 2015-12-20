/*
 * Config
 */
(function(sim) {

	var modules = {},
		savedGlobalData = {},
		load = {};

	function load() {
		return Q($.GETJSON('/api/load')).then(function(data){
			modules = data.modules;
			savedGlobalData = data.savedGlobalData;
			savedUserData = data.savedUserData;
		});
	}

	sim.config = {
		// there are two minified files containing all the module css and javascript
		// modules : { templates : [], css : '', js : ''}
		templates : null,
		savedGlobalData : null,
		savedUserData : null,
		load : null


	};

})(window.sim = window.sim || {});


/*
 *	Config Modal
 */
(function(sim) {


	var $cache = {
		modal : $('#config-modal'),
		openBtn : null,
		closeBtn : null,
		xBtn : null,
		applyBtn : null,
		categoryTabs : $('#config-modal .config-categories'),
		categories : [],
		form : null,
	};

	function getCurrentCategoryId() {
		return $cache.categoryTabs.find('li.active');
	}

	function changeCategory($el) {
		$cache.categoryTabs.find('li').removeClass('active');
		$cache.modal.find('.category').remove('active');
		var categoryId = $el.data('category-id');
		$el.addClass('active');
		$cache.categories[categoryId].addClass('active');
	}

	// Modal Events
	$cache.modal.on('hidden.bs.modal', function(e) {
		$cache.modal.trigger('modalClose');
	});

	$cache.modal.on('show.bs.modal', function(e) {
		$cache.modal.trigger('modalOpen');
	});

	$cache.categoryTabs.on('click', 'li', function(e) {
		var $el = $(this);
		changeCategory($el);
		var categoryId = $el.data('category-id');
		var $category = $cache.categories[categoryId];
		$cache.modal.trigger('categoryChange', [categoryId, $category]);
	});

	$cache.applyBtn.on('click', function(e) {
		var currentCategoryId = getCurrentCategoryId();
		var $category = $cache.categories[currentCategoryId];
		$cache.modal.trigger('categorySave', [categoryId, $category]);
	});

	sim.configModal = {
		$el: $cache.modal,
		$categories : $cache.categories,
		addCategory : null,
		removeCategory : null
	};

})(window.sim = window.sim || {});
