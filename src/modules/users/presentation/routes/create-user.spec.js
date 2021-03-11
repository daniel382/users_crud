class CreateUser {
  constructor (comparePasswordUseCase) {
    this.comparePasswordUseCase = comparePasswordUseCase
  }

  async store (httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body

    if (!email || !password || !repeatPassword) {
      return { statusCode: 400 }
    }

    if (!this.comparePasswordUseCase.compare(password, repeatPassword)) {
      return { statusCode: 400 }
    }
  }
}

function makeSut () {
  const comparePasswordUseCaseSpy = makeComparePasswordUseCaseSpy()
  const sut = new CreateUser(comparePasswordUseCaseSpy)

  return { sut, comparePasswordUseCaseSpy }
}

function makeComparePasswordUseCaseSpy () {
  class ComparePasswordUseCaseSpy {
    compare (password, repeatPassword) {
      this.password = password
      this.repeatPassword = repeatPassword

      return false
    }
  }

  return new ComparePasswordUseCaseSpy()
}

describe('Create User', function () {
  it('should return 400 if no email is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    const httpResponse = await sut.store(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 400 if no password is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        repeatPassword: 'any_password'
      }
    }

    const httpResponse = await sut.store(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 400 if no repeatPassword is provided', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.store(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should return 400 if password and repeatPassword are not equal', async function () {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'other_password'
      }
    }

    const httpResponse = await sut.store(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('should call ComparePasswordUseCase with correct values', async function () {
    const { sut, comparePasswordUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    await sut.store(httpRequest)

    expect(comparePasswordUseCaseSpy.password).toBe('any_password')
    expect(comparePasswordUseCaseSpy.repeatPassword).toBe('any_password')
  })
})
