'use strict';

import { PropTypes } from 'react'

export default PropTypes.shape({
  publish: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired
})
