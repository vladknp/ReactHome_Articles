const ListTags = React.createClass({
    handleClickTag() {
        this.props.onSearchByTag(this.props.name);
    },

    render() {
        const { name, count } = this.props;

        return (
            <li>
                <a href="#" onClick={this.handleClickTag}>
                    <span>{name} - {count}</span>
                </a>
            </li>
        );
    }
});

const ListItem = React.createClass({
    render() {
        const { children } = this.props;

        return <li className="label primary">{children}</li>;
    }
});

const ListItems = React.createClass({
    render() {
        const { list } = this.props;

        return (
            <ul className="no-bullet">
                {list.map(item => <ListItem key={item}>{item}</ListItem>)}
            </ul>
        );
    }
});

const RemarkableRender = React.createClass({
    getInitialState() {
        return {
            html: ""
        };
    },

    componentDidMount() {
        this.remarkable = new Remarkable("full");

        this.setState({
            html: this.remarkable.render(this.props.text)
        });
    },

    render() {
        return <div dangerouslySetInnerHTML={{ __html: this.state.html }} />;
    }
});

const Article = React.createClass({
    getInitialState() {
        return {
            isCollapse: true
        };
    },

    handleCollapse(e) {
        e.preventDefault();

        this.props.onCollapse(this.props.id);
    },

    handleEdit() {
        this.props.onEdit(this.props.id);
    },

    render() {
        const { title, text, tags, isCollapse } = this.props;
        // console.log(tags, ' --tags');

        return (
            <div>
                <h2 title="Click me to collapse" onClick={this.handleCollapse}>
                    <a href="#" className="subheader">{title}</a>
                </h2>

                {isCollapse && <RemarkableRender text={text} />}

                <ListItems list={tags} />

                <button
                    onClick={this.handleEdit}
                    type="button"
                    className="secondary button tiny"
                >
                    Edit Article
                </button>
            </div>
        );
    }
});

const ArticleEditor = React.createClass({
    getInitialState() {
        return {
            title: "",
            text: "",
            tags: "",
            isPreview: false
        };
    },

    componentDidMount() {
        this.setState({
            title: this.props.title,
            text: this.props.text,
            tags: this.props.tags && this.props.tags.join(" "),
            isPreview: this.props.isPreview
        });
    },

    handleTitleChange(title) {
        this.setState({
            title: title.target.value
        });
    },

    handleTextChange(text) {
        this.setState({
            text: text.target.value
        });
    },

    handleArticleAdd() {
        const newArticle = {
            title: this.state.title,
            text: this.state.text,
            tags: this.makeTagArray(this.state.tags),
            id: Date.now(),
            isCollapse: true,
            isEdit: false
        };

        this.props.onArticleAdd(newArticle);

        this.resetInputs();
    },

    handlePreview() {
        const newState = !this.state.isPreview;

        this.setState({
            isPreview: newState
        });
    },

    handleCancelPreview() {
        this.props.onCancelPreview(this.props.id);
    },

    handleArticleSave() {
        const article = {
            title: this.state.title,
            text: this.state.text,
            tags: this.makeTagArray(this.state.tags),
            id: this.props.id,
            isEdit: false
        };

        this.props.onSave(article);
    },

    handleTagsChange(event) {
        this.setState({
            tags: event.target.value
        });
    },

    resetInputs() {
        this.setState({
            title: "",
            text: "",
            tags: "",
            isPreview: false,
            isEdit: false
        });
    },

    makeTagArray(state) {
        const clearTags = new Set(state.split(" "));

        return [...clearTags];
    },

    render() {
        const { isEdit } = this.props;

        return (
            <div className="columns small-12">
                {this.state.isPreview
                    ? <div className="columns">
                          <h2>{this.state.title}</h2>

                          <RemarkableRender text={this.state.text} />

                          <ListItems
                              list={this.makeTagArray(this.state.tags)}
                          />
                      </div>
                    : <div className="large-12">
                          <input
                              type="text"
                              placeholder="Enter the title"
                              value={this.state.title}
                              onChange={this.handleTitleChange}
                          />

                          <textarea
                              cols="30"
                              rows="10"
                              placeholder="Enter the text of the article"
                              value={this.state.text}
                              onChange={this.handleTextChange}
                          />

                          <input
                              type="text"
                              placeholder="Enter you tags from spase"
                              value={this.state.tags}
                              onChange={this.handleTagsChange}
                          />
                      </div>}

                <div className="button-group tiny">
                    {isEdit
                        ? <button
                              onClick={this.handleArticleSave}
                              type="button"
                              className="success button tiny"
                          >
                              Save
                          </button>
                        : <button
                              onClick={this.handleArticleAdd}
                              type="button"
                              className="success button tiny"
                          >
                              Add article
                          </button>}

                    <button
                        href="#"
                        onClick={this.handlePreview}
                        type="button"
                        className="button tiny"
                    >
                        {this.state.isPreview ? "Edit" : "Preview"}
                    </button>

                    <button
                        className="button secondary tiny"
                        onClick={this.handleCancelPreview}
                    >
                        Cancel
                    </button>
                </div>

                <hr />
            </div>
        );
    }
});

const ArticleView = React.createClass({
    handleDelete() {
        this.props.onDelete(this.props.id);
    },

    render() {
        const {
            title,
            text,
            tags,
            isCollapse,
            isEdit,
            onCollapse,
            onArticleViewEdit,
            onArticleSave,
            onArticleViewCancelPreview,
            id
        } = this.props;

        return (
            <div className="callout secondary">
                <button
                    type="button"
                    className="close-button"
                    onClick={this.handleDelete}
                >
                    <span aria-hidden="true">&times;</span>
                </button>

                {isEdit
                    ? <ArticleEditor
                          title={title}
                          text={text}
                          tags={tags}
                          isEdit={isEdit}
                          onSave={onArticleSave}
                          onCancelPreview={onArticleViewCancelPreview}
                          id={id}
                      />
                    : <Article
                          title={title}
                          text={text}
                          tags={tags}
                          id={id}
                          isCollapse={isCollapse}
                          onCollapse={onCollapse}
                          onEdit={onArticleViewEdit}
                      />}
            </div>
        );
    }
});

const ArticleGrid = React.createClass({
    render() {
        const {
            articles,
            onArticleViewDelete,
            onArticleCollapse,
            onArticleEdit,
            onArticleCancelPreview,
            onArticleViewSave
        } = this.props;

        return (
            <div className="columns">
                {articles.map(article =>
                    <ArticleView
                        title={article.title}
                        text={article.text}
                        tags={article.tags}
                        isCollapse={article.isCollapse}
                        isEdit={article.isEdit}
                        key={article.id}
                        id={article.id}
                        onDelete={onArticleViewDelete}
                        onCollapse={onArticleCollapse}
                        onArticleViewEdit={onArticleEdit}
                        onArticleSave={onArticleViewSave}
                        onArticleViewCancelPreview={onArticleCancelPreview}
                    />
                )}
            </div>
        );
    }
});

const ArticleApp = React.createClass({
    getInitialState() {
        return {
            articles: [],
            found: [],
            textSearch: "",
            tags: [],
            isNewArtirle: false
        };
    },

    componentDidMount() {
        const saveArticles = JSON.parse(localStorage.getItem("articles"));

        if (saveArticles) {
            this.setState(
                {
                    articles: saveArticles,
                    found: saveArticles
                },
                () => this.ratingTags()
            );
        }
    },

    componentDidUpdate() {
        const articles = JSON.stringify(this.state.articles);

        localStorage.setItem("articles", articles);
    },

    ratingTags() {
        const newRating = this.state.articles.reduce((previous, current) => {
            current.tags.forEach(tag => {
                if (previous[tag] === undefined) {
                    previous[tag] = 1;
                } else {
                    previous[tag] = previous[tag] + 1;
                }
            });

            return previous;
        }, {});

        const makeRating = Object.keys(newRating)
            .map(key => {
                return { name: key, count: newRating[key], id: key };
            })
            .sort((a, b) => b.count - a.count);

        this.setState({
            tags: makeRating
        });
    },

    handleCreateArticle() {
        this.setState({
            isNewArtirle: !this.state.isNewArtirle
        });
    },

    handleArticleAdd(newArticle) {
        this.setState(
            {
                articles: [newArticle, ...this.state.articles]
                // tags: [{ name: 'music', count: 10 },{ name: 'java', count: 3 },{ name: 'build', count: 5 }],
            },
            () => {
                this.handleArticleSearch(this.state.textSearch);

                this.handleCreateArticle();

                this.ratingTags();
            }
        );
    },

    handleArticleViewDelete(id) {
        this.setState(
            {
                articles: this.state.articles.filter(
                    article => article.id !== id
                )
            },
            () => {
                this.handleArticleSearch(this.state.textSearch);

                this.ratingTags();
            }
        );
    },

    handleArticleCollapse(id) {
        const newArticles = this.state.articles.map(article => {
            article.id === id && (article.isCollapse = !article.isCollapse);

            return article;
        });

        this.setState({
            articles: newArticles
        });
    },

    handleArticleEdit(id) {
        const newArticles = this.state.articles.map(article => {
            article.id === id && (article.isEdit = !article.isEdit);

            return article;
        });

        this.setState({
            articles: newArticles
        });
    },

    handleArticleCancelPreview(id) {
        if (id) {
            const newArticles = this.state.articles.map(article => {
                article.id === id && (article.isEdit = !article.isEdit);

                return article;
            });

            this.setState({
                articles: newArticles
            });

            return;
        }

        this.setState({
            isNewArtirle: !this.state.isNewArtirle
        });
    },

    handleArticleSave(newArticle) {
        const saveArticles = this.state.articles.map(article => {
            if (article.id === newArticle.id) {
                article = { ...article, ...newArticle };
            }

            return article;
        });

        this.setState(
            {
                articles: saveArticles
            },
            () => {
                this.handleArticleSearch(this.state.textSearch);

                this.ratingTags();
            }
        );
    },

    handleArticleSearch(event) {
        const text = event.target ? event.target.value : this.state.textSearch;

        let reg = new RegExp(text.toLowerCase());
        let regTag = new RegExp(text.toLowerCase());

        if (text.length === 0) {
            this.setState({
                found: this.state.articles
            });

            return;
        }

        let searchBy = "title";

        const regSufix = /\w+:\s/g;

        const matchSuffix = text.match(regSufix);

        if (matchSuffix) {
            const matchWord = matchSuffix[0];

            if (matchWord === "tag: ") {
                searchBy = "tags";

                regTag = new RegExp(
                    text.replace(regSufix, "").toLowerCase() + "\\b"
                );
                console.log("tag: ", regTag);

                this.setState({
                    found: filterByTag(this.state.articles),
                    textSearch: text
                });

                return;
            }

            if (matchWord === "body: ") {
                searchBy = "text";

                reg = new RegExp(text.replace(regSufix, "").toLowerCase());
                console.log("body: ", reg);
            }
        }

        this.setState({
            found: this.state.articles.filter(article =>
                reg.test(article[searchBy].toLowerCase())
            ),
            textSearch: text
        });

        function filterByTag(articleArray) {
            return articleArray.filter(item => {
                const string = item[searchBy].join(" ");

                return regTag.test(string.toLowerCase());
            });
        }
    },

    handleSearchByTag(name) {
        const text = "tag: " + name;

        this.setState(
            {
                textSearch: text
            },
            () => this.handleArticleSearch(this.state.textSearch)
        );
    },

    render() {
        const { isNewArtirle } = this.state;

        return (
            <div className="row">
                <h1 className="columns small-12 text-center">
                    Articles <hr />
                </h1>

                {isNewArtirle
                    ? <ArticleEditor
                        onArticleAdd={this.handleArticleAdd}
                        onCancelPreview={this.handleArticleCancelPreview}
                      />
                    : <div className="columns small-12">
                        <button
                            className="button tiny"
                            onClick={this.handleCreateArticle}
                        >
                            Create Article
                        </button>
                    </div>}

                <div className="columns small-12">
                    <input
                        type="search"
                        placeholder="Search by Title, by Tag (tag:), by content (body:)"
                        onChange={this.handleArticleSearch}
                    />
                </div>

                <div className="columns small-12 large-2">
                    <h5>Popular tags</h5>

                    <ul className="no-bullet button-group stacked-for-small">
                        {this.state.tags.map(tag =>
                            <ListTags
                                key={tag.id}
                                id={tag.id}
                                name={tag.name}
                                count={tag.count}
                                onSearchByTag={this.handleSearchByTag}
                            />
                        )}
                    </ul>
                </div>

                <ArticleGrid
                    articles={this.state.found}
                    onArticleViewDelete={this.handleArticleViewDelete}
                    onArticleCollapse={this.handleArticleCollapse}
                    onArticleEdit={this.handleArticleEdit}
                    onArticleViewSave={this.handleArticleSave}
                    onArticleCancelPreview={this.handleArticleCancelPreview}
                />
            </div>
        );
    }
});

ReactDOM.render(<ArticleApp />, document.getElementById("root"));
