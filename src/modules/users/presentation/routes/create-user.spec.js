const CreateUser = require('./create-user')

function makeSut () {
  const comparePasswordUseCaseSpy = makeComparePasswordUseCaseSpy()
  const hashPasswordSpy = makeHashPassword()
  const sut = new CreateUser(comparePasswordUseCaseSpy, hashPasswordSpy)

  return { sut, comparePasswordUseCaseSpy, hashPasswordSpy }
}

function makeComparePasswordUseCaseSpy () {
  class ComparePasswordUseCaseSpy {
    compare (password, repeatPassword) {
      this.password = password
      this.repeatPassword = repeatPassword

      return this.isEqual
    }
  }

  const comparePasswordUseCaseSpy = new ComparePasswordUseCaseSpy()
  comparePasswordUseCaseSpy.isEqual = true
  return comparePasswordUseCaseSpy
}

function makeHashPassword () {
  class HashPasswordSpy {
    hash (password) {
      this.password = password
    }
  }

  const hashPasswordSpy = new HashPasswordSpy()

  return hashPasswordSpy
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
    const { sut, comparePasswordUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'other_password'
      }
    }

    comparePasswordUseCaseSpy.isEqual = false
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

  it('should call HashPassword with correct values', async function () {
    const { sut, hashPasswordSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
        repeatPassword: 'any_password'
      }
    }

    await sut.store(httpRequest)

    expect(hashPasswordSpy.password).toBe('any_password')
  })
})
