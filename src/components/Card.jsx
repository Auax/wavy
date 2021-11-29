import React from 'react';
import { withRouter, Link } from 'react-router-dom';

class Card extends React.Component {
    render() {
        return (
            <div className="bot-card mb-2 tr-f" key={this.props.key}>
                <Link to={this.props.link}>
                    <div className="row">
                        <div className="col">
                            <h3 className="card-title">{this.props.title}
                                {this.props.is_private && <i className="fas fa-lock" data-mdb-toggle="tooltip" title="Private room"></i>}
                            </h3>
                            {
                                /* Render subtitles */
                                this.props.subtitles &&
                                this.props.subtitles.map(function (subtitle) {
                                    return (<p key={subtitle} className="card-subtitle">{subtitle}</p>)
                                })
                            }
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
};

export default withRouter(Card);