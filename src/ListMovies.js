import React from 'react';
import { Link } from "react-router-dom";
import { Card, Icon, Header, Button } from 'semantic-ui-react';
import axios from 'axios';
import { ApiNowPlaying } from './Api/ApiNowPlaying';

const extra = (price,idMovie, titleMovie) => (
    <Link to={'/'+idMovie+'-'+titleMovie}>
        <Icon name='shopping cart' />
        {price}
    </Link>
)

let pageMovie = 1;

class ListMovies extends React.Component {
    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    state = {
      movies: []
    }
  
    componentWillMount() {
        axios.get(ApiNowPlaying(pageMovie))
            .then(res => {
                const movies = res.data.results;
                this.setState({ movies });
        })
    }

    handleClick = () => {
        pageMovie++;
        axios.get(ApiNowPlaying(pageMovie))
            .then(res => {
                const movies = res.data.results;
                this.setState({
                    movies: movies
                });
        })
        this.props.history.push('/?page='+pageMovie)
    }

    render() {
        const DetailCard = this.state.movies.map((movie, key) => {
            let Price;
            let Rate = movie.vote_average;
            let AlreadyHave;
            let PathMovie = movie.title;
            PathMovie = PathMovie.replace(/[^a-zA-Z0-9&]+/g, '-').toLowerCase();
            if (Rate < 1){
                Price = '--'
            } else if (Rate >= 0 && Rate <= 3){
                Price = Number(3.500).toFixed(3);
                AlreadyHave = 'Already Have.'
            } else if(Rate > 3 && Rate <= 6){
                Price = Number(8.250).toFixed(3);
                AlreadyHave = 'Already Have.'
            } else if(Rate > 6 && Rate <= 8){
                Price = Number(16.350).toFixed(3);
            } else {
                Price = Number(21.250).toFixed(3);
            }

            return (
                <Card key={key + 1}
                    image={'https://image.tmdb.org/t/p/w342'+movie.poster_path}
                    header={movie.title}
                    meta={AlreadyHave}
                    extra={extra(Price, movie.id, PathMovie)}
                />
            )
        })
        return (
            <div>
                <Header as='h1'>Now Playing</Header>
                <Card.Group itemsPerRow={4}>
                    {DetailCard.length > 0? DetailCard : (<span className="no-result">No Movies</span>)}
                </Card.Group>
                {DetailCard.length > 0? (
                    <Button className="btn-loadmore" content='Load More' onClick={this.handleClick} />
                ) : (
                    <a href="/"><Button className="btn-loadmore">Back to Home</Button></a>
                )}
            </div>
        )
    }
}

export default ListMovies